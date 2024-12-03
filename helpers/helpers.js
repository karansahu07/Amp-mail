const path = require("path");
const ejs = require("ejs");
const fs = require("fs");

const getHtmlFromTemplate = (template, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname,"..","templates",template+".ejs"),
      data ?? {},
      (err, htmlContent) => {
        if (err) {
          reject(err);
        } else {
          resolve(htmlContent);
        }
      }
    );
  });
};

const getFeedbacks = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "..","data","feedbacks.json"),'utf8', (err, data) => {
      if (err) reject(err);
      else {
        console.log("data",data)
        if(data) resolve(JSON.parse(data))
        else resolve([])
      }
    });
  });
};

const addFeedbackToFile=(data)=>{
  return new Promise(async(resolve, reject) => {
    try {
      let feedbacks = await getFeedbacks()
      if(!feedbacks){
        feedbacks = []
      }
      feedbacks.push(data)
      fs.writeFile(path.join(__dirname,"..","data","feedbacks.json"),JSON.stringify(feedbacks,null,2),'utf-8',(err)=>{
        if(err){
          reject(err)
        } else {
          resolve("written successfully")
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  getHtmlFromTemplate,
  getFeedbacks,
  addFeedbackToFile
};
