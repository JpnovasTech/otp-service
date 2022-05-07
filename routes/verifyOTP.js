/* eslint-disable no-console */
const {client} = require('../redisClient');
const router = require("express").Router();
const {decode} = require("../middlewares/crypt")



/**
 * @swagger
 * /verify/otp:
 *   post:
 *     tags:
 *       - OTP
 *     name: Verify OTP
 *     summary: Verify OTP
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             otp:
 *               type: string
 *             verification_key:
 *               type: string
 *             check:
 *               type: string
 *         required:
 *           - otp
 *           - verification_key
 *           - check
 *     responses:
 *       '200':
 *         description: OTP Matched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/VerificationDetails'
 *               type: object
 *               properties:
 *                Status:
 *                  type: string
 *                Details:
 *                  type: string
 *                Check:
 *                  type: string
 *       '400':
 *         description: OTP cannot be verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Details'
 *               type: object
 *               properties:
 *                Status:
 *                  type: string
 *                Details:
 *                  type: string
 */


router.post('/verify/otp', async (req, res, next) => {
  try{
    var currentdate = new Date(); 
    const {verification_key, otp, check} = req.body;
    
    if(!verification_key){
      const response={"Status":"Failure","Details":"Verification Key not provided"}
      return res.status(400).send(response) 
    }
    if(!otp){
      const response={"Status":"Failure","Details":"OTP not Provided"}
      return res.status(400).send(response) 
    }
    if(!check){
      const response={"Status":"Failure","Details":"Check not Provided"}
      return res.status(400).send(response) 
    }

    let decoded;

    //Check if verification key is altered or not and store it in variable decoded after decryption
    try{
      decoded = await decode(verification_key)
    }
    catch(err) {
      const response={"Status":"Failure", "Details":"Bad Request"}
      return res.status(400).send(response)
    }

    var obj= JSON.parse(decoded)
    const check_obj = obj.check
    
    // Check if the OTP was meant for the same email or phone number for which it is being verified 
    if(check_obj!=check){
      const response={"Status":"Failure", "Details": "OTP was not sent to this particular email or phone number"}
      return res.status(400).send(response) 
    }

    const otp_instance= await client.get(verification_key);

    //Check if OTP is available in the DB
    if(otp_instance!=null){
          
              //Check if OTP is equal to the OTP in the DB
              if(otp===otp_instance){
                  client.del(verification_key);
                  client.setEx(check,86400,verification_key);
                  const response={"Status":"Success", "Details":"OTP Matched", "verification_key": verification_key}
                  return res.status(200).send(response)
              }
              else{
                  const response={"Status":"Failure","Details":"OTP NOT Matched"}
                  return res.status(400).send(response) 
              }
            
      }
      else{
          const response={"Status":"Failure","Details":"OTP Expired"}
          return res.status(400).send(response)
      }
  }
  catch(err){
    const response={"Status":"Failure","Details": err.message}
    return res.status(400).send(response)
  }
});

 
module.exports = router;
