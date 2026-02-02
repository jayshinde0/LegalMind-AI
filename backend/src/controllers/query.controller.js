const retrievalService = require('../services/retrieval.service');

class QueryController {
  async processQuery(req, res, next) {
    try {
      const { query } = req.body;

      const result = await retrievalService.query(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueryController();
