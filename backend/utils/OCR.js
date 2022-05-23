const request = require("request");
const imageBuffer = require("request").defaults({ encoding: null });

const OCR = async (pic) => {
  const image = imageBuffer.get(pic, function (err, res, body) {
    // console.log(res);
  });
  return new Promise(function (resolve, reject) {
    const options = {
      method: "POST",
      url: "https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/",
      headers: {
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
        "X-RapidAPI-Host": "pen-to-print-handwriting-ocr.p.rapidapi.com",
        "X-RapidAPI-Key": "5cd2a107femsh5d8949603242e20p17cc44jsn9b0627dd252f",
        useQueryString: true,
      },
      formData: {
        srcImg: {
          value: image,
          options: {},
        },
        Session: "string",
      },
    };
    request(options, function (error, response, body) {
      if (error) reject(error);
      resolve(JSON.parse(body).value);
    });
  });
};

module.exports = OCR;
