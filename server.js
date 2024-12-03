const express = require("express")
const { getFeedbacks, addFeedbackToFile, getHtmlFromTemplate } = require("./helpers/helpers");
const addEmailToQueue = require("./queues/emailQueue");

const server = express()

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.set('view engine','ejs')
server.post("/feedback", async(req,res,next)=>{
  try {
    const data = req.body
    const r = await addFeedbackToFile({data, timestamp:new Date().toISOString()})
    res.render("thankyou",{your_name:req.body?.your_name}).end()
  } catch (error) {
    res.status(500).json({err:error,data:null})
  }
})  

server.get("/feedback",async(req,res)=>{
  try {
    const data = await getFeedbacks()
    res.status(200).json({err:null,data})
  } catch (error) {
    res.status(500).json({data:null,err:error})
  }
})

server.post("/email",async(req,res)=>{
  try {
    const {template,email} = req.body
    const html = await getHtmlFromTemplate(template,null)
    addEmailToQueue(email,"Test subject",html)
    res.status(200).json({err:null,data:"success"})
  } catch (error) {
    console.log(error)
    res.status(500).json({err:error,data:null})
  }
})

server.listen(8000,(err)=>{
  if(err){
    console.log(err)
  }
  console.log("Server started successfully")
})