import React from "react"
import { Helmet } from "react-helmet"

const MetaData = ({ title }) => {
  return (
    <Helmet>
      <title>{`${title} - Smart Cart`}</title>
    </Helmet>
  )
}

export default MetaData
