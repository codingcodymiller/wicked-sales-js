require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const query = `
    select  "productId",
            "name",
            "price",
            "image",
            "shortDescription"
    from    "products"
  `;
  db.query(query)
    .then(result => res.status(200).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/products/:productId', (req, res, next) => {
  const query = `
    select  "productId",
            "name",
            "price",
            "image",
            "shortDescription",
            "longDescription"
    from    "products"
    where   "productId" = $1
  `;
  const values = [req.params.productId];
  db.query(query, values)
    .then(result => {
      if (!result.rows.length) return next(new ClientError('No products found matching provided ID', 404));
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  if (!req.session.cartId) return res.status(200).json([]);

  const query = `
    select  "c"."cartItemId",
            "c"."price",
            "p"."productId",
            "p"."image",
            "p"."name",
            "p"."shortDescription"
    from    "cartItems" as "c"
    join    "products" as "p" using ("productId")
    where   "c"."cartId" = $1
  `;
  const values = [req.session.cartId];
  db.query(query, values)
    .then(result => res.status(200).json(result.rows));
});

app.post('/api/cart', (req, res, next) => {
  const POSITIVE_INT_REGEXP = /^[1-9]\d*$/;
  if (!POSITIVE_INT_REGEXP.test(req.body.productId)) return next(new ClientError('productId must be a positive integer', 400));

  const query = `
      select "price"
      from   "products"
      where  "productId" = $1
  `;
  const values = [req.body.productId];
  db.query(query, values)
    .then(result => {
      if (!result.rows.length) throw new ClientError('No products found matching provided ID', 400);
      const { price } = result.rows[0];
      const { cartId } = req.session;
      if (cartId) {
        return Promise.resolve({ price, cartId });
      }
      const query = `
        insert into "carts" ("cartId", "createdAt")
        values              (default, default)
        returning           "cartId"
      `;
      return db.query(query).then(result => {
        const { cartId } = result.rows[0];
        return { price, cartId };
      });
    })
    .then(({ price, cartId }) => {
      req.session.cartId = cartId;
      const query = `
        insert into "cartItems" ("cartId", "productId", "price")
        values                  ($1, $2, $3)
        returning               "cartItemId"
      `;
      const values = [cartId, req.body.productId, price];
      return db.query(query, values).then(result => {
        const query = `
          select "c"."cartItemId",
                  "c"."price",
                  "p"."productId",
                  "p"."image",
                  "p"."name",
                  "p"."shortDescription"
          from    "cartItems" as "c"
          join    "products" as "p" using ("productId")
          where   "c"."cartItemId" = $1
        `;
        const values = [result.rows[0].cartItemId];
        return db.query(query, values).then(result => res.status(201).json(result.rows[0]));
      });
    })
    .catch(err => next(err));
});

app.post('/api/orders', (req, res, next) => {
  if (!req.session.cartId) return next(new ClientError('A shopping cart id must be provided in order to complete an order.', 400));

});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
