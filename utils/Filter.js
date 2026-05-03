const mongoose = require("mongoose")

exports.Filter = (req) => {
    // let filter = {}
    // if (req.filterObj) {
    //     filter = req.filterObj
    // }

    // exclude the page limit from search parameters
    const { page, limit, ...filters } = req.query
    const search =
        Object.keys(filters).length > 0
            ? {
                  $and: Object.keys(filters).map((key) => {
                      if (filters[key] != null && filters[key] != "null" && filters[key] != "") {
                          if (
                              key != "search" &&
                              !mongoose.Types.ObjectId.isValid(filters[key]) &&
                              typeof filters[key] != "boolean" &&
                              filters[key] !== "true" &&
                              filters[key] !== "false" &&
                              key != "year"
                          ) {
                              if (filters[key] != null) return { [key]: { $regex: filters[key], $options: "i" } }
                          } else {
                              if (filters[key] != null) return { [key]: filters[key] }
                          }
                      } else {
                          return {}
                      }
                  }),
              }
            : {}

    return search
}
