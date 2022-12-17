export const user_api = {
/**
 * @api {post} /user/login Login
 * @apiName login
 * @apiGroup user
 * 
 * @apiDescription Login service
 * 
 * @apiBody {String} userName username
 * @apiBody {String} password user's password
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
 *          "message" : "Username or password error"
 *      }
 */


/**
 * @api {get} /user/logout Logout
 * @apiName logout
 * @apiGroup user
 * 
 * @apiDescription Logout service
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
 *          "message" : "Username or password error"
 *      }
 */


/**
 * @api {post} /user/register Register
 * @apiName register
 * @apiGroup user
 * 
 * @apiDescription register account
 * @apiBody {String} name user's name
 * @apiBody {String} userName username
 * @apiBody {String} email user's email
 * @apiBody {String} password user's password
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
 *          "message" : "Username or password error"
 *      }
 * 
 *  @apiErrorExample Error-Response:
 *      HTTPS 401 error
 *      {
 *          "message" : "Username duplicate please try another"
 *      }
 */
}