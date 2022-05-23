const mongoose = require("mongoose");

const moneyTransferSchema = mongoose.Schema(
    {
        amount:{
            type: String,
            required: true
        },
        senderAccount:{
            type: String,
            required: true
        },
        recieverAccount:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true,
            default:"pending"
        },
        reason:{
            type: String,
            required: true,
            default:"Miscllenous"
        },
        senderBank:{
            type: String,
            required: true
        },
        recieverBank:{
            type: String,
            required: true
        },
        fee:{
            type: String,
            required: true
        }
      },
      {
        timestamps: true,
      }
);



const moneyTransfer = mongoose.model("MoneyTransfer", moneyTransferSchema);

module.exports = moneyTransfer;
