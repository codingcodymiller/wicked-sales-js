function getCart(req, db) {
  const { cartId } = req.session;
  if (!cartId) {
    return (
      db.query(`insert into "carts" ("cartId", "createdAt")
              values (default, default)
              returning "cartId"`)
        .then(result => {
          const { cartId } = result.rows[0];
          return { cartId };
        })
    );
  }
  return new Promise(resolve => resolve({ cartId }));
}

module.exports = {
  getCart
};
