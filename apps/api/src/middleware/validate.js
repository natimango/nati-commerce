export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      next(error)
    }
  }
}
