export const data_upload_api = {
/**
 * @api {post} /upload/post_board_upload Upload post_board file
 * @apiName post_board_upload
 * @apiGroup upload
 * 
 * @apiBody {String} stock_num_name stock_num_name
 * @apiBody {String} date create date
 * @apiBody {String} evaluation evaluation
 * @apiBody {String} price recommend price
 * @apiBody {String} reason recommend reason
 *
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "message" : "success"
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */


/**
 * @api {post} /upload/meeting_data_upload Upload meeting_data file
 * @apiName meeting_data_upload
 * @apiGroup upload
 * 
 * @apiBody {String} filename filename
 *
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "message" : "success"
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */


/**
 * @api {post} /upload/industry_analysis_upload Upload industry_analysis file
 * @apiName industry_analysis_upload
 * @apiGroup upload
 * 
 * @apiBody {String} title title
 * @apiBody {String} filename filename
 *
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "message" : "success"
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */


/**
 * @api {post} /upload/line_memo_upload Upload line_memo file
 * @apiName line_memo_upload
 * @apiGroup upload
 * 
 * @apiBody {String} stock_num_name stock_num_name
 * @apiBody {String} date create date
 * @apiBody {String} content content
 * @apiBody {String} evaluate evaluate
 * @apiBody {String} filename filename
 * 
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "message" : "success"
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */


/**
 * @api {post} /upload/self_upload Upload self file
 * @apiName self_upload
 * @apiGroup upload
 * 
 * @apiBody {String} ticker stock_num_name
 * @apiBody {String} date create date
 * @apiBody {String} provider provider
 *
 * @apiSuccessExample Success-Response:
 *      HTTPS 200 OK
 *      {
 *          "message" : "success"
 *      }
 *
 *  @apiErrorExample Error-Response:
 *      HTTPS 400 error
 *      {
 *          "message" : "error"
 *      }
 */
}