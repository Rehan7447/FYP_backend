const mongoose = require("mongoose");

const chequeTransactionSchema = mongoose.Schema(
  {
    amount:{
        type: String,
        required: true
    },
    senderAccount:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    recieverAccount:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    reason:{
        type: String,
        required: true,
        default:"Miscllenous"
    },
    chequeImage:{
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);



const chequeTransaction = mongoose.model("ChequeTransaction", chequeTransactionSchema);

module.exports = chequeTransaction;
