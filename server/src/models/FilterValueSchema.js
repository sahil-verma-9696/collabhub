import mongoose from "mongoose";
const filterValueSchema = new mongoose.Schema(
  {
    filter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Filter",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: String,
  },
  { timestamps: true },
);

const FilterValue = mongoose.model("FilterValue", filterValueSchema);
module.exports = FilterValue;
