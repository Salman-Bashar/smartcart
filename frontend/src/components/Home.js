import React, { Fragment, useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import Pagination from "react-js-pagination"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

import MetaData from "./layout/MetaData"
import Loader from "./layout/Loader"
import Product from "./product/Product"

import { getProducts } from "../actions/productActions"

const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([1, 1000])
  const [category, setCategory] = useState("")
  const [rating, setRating] = useState(0)

  const categories = ["Food", "Cloths", "Electronics", "Books"]

  const dispatch = useDispatch()
  const alert = useAlert()

  const {
    loading,
    products,
    error,
    productCount,
    productPerPage,
    filteredProductCount,
  } = useSelector((state) => state.products)

  const keyword = match.params.keyword

  useEffect(() => {
    if (error) return alert.error(error)

    dispatch(getProducts(currentPage, keyword, price, category, rating))
  }, [dispatch, alert, error, currentPage, keyword, price, category, rating])

  function setCurrentPageNo(pageNumer) {
    setCurrentPage(pageNumer)
  }

  let count = productCount
  if (keyword) count = filteredProductCount

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Home"} />

          <h1 id='products_heading'>Latest Products</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {keyword ? (
                <Fragment>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <h4 className='mb-3'>Price Range</h4>
                      <Range
                        marks={{ 1: "$1", 1000: "$1000" }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{ placement: "top", visible: false }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />

                      <hr className='my-5' />

                      <div className='mt-5'>
                        <h4 className='mb-3'>Categories</h4>

                        <ul className='pl-0'>
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <hr className='my-3' />

                      <div className='mt-5'>
                        <h4 className='mb-3'>Ratings</h4>

                        <ul className='pl-0'>
                          {[5, 4, 3, 2, 1, 0].map((star) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={star}
                              onClick={() => setRating(star)}
                            >
                              <div className='rating-outer'>
                                <div
                                  className='rating-inner'
                                  style={{ width: `${star * 20}%` }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='col-6 col-md-9'>
                    <div className='row'>
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <div className='mt-5'>
                        <h4 className='mb-3'>Categories</h4>

                        <ul className='pl-0'>
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='col-6 col-md-9'>
                    <div className='row'>
                      {products.map((product) => (
                        <Product key={product._id} product={product} col={4} />
                      ))}
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </section>
          {productPerPage <= count && (
            <div className='d-flex justify-content-center mt-5'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"Prev"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default Home
