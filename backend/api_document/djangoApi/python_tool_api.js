export const python_tool_api = {
/**
 * @api {get} /PricingStrategy Run pricing strategy
 * @apiName PricingStrategy
 * @apiGroup Stock tool
 * 
 * @apiQuery {String} stockNum stock num
 * @apiQuery {String} year year
 *
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "NewPrice" : 471,
 *          "down_cheap" : [114.67, 149.02, 195.96, 238.87],
 *          "cheap_reasonable" : [28.66, 40.44, 46.3, 58.91],
 *          "reasonable_expensive" : [86, 43.2, 50.02, 62.62],
 *          "up_expensive" : [311.27, 307.94, 248.32, 180.2],
 *          "cheap" : [114.67, 149.02, 195.96, 238.87],
 *          "reasonable" : [143.33, 189.46, 242.26, 297.78],
 *          "expensive" : [229.33, 232.66, 292.28, 360.4],
 *          "Value lose" : [false, false, false, false, false],
 *          "dividend_table" : { "data" : {table_data} },
 *          "high_low_table" : { "data" : {table_data} },
 *          "PER_table" : { "data" : {table_data} },
 *          "PBR_table" : { "data" : {table_data} }
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */
}