import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://workbridge-backend-munl.onrender.com/api/jobs/${id}`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok === true && data) {
      const updatedJobDetails = {
        title: data.title,
        description: data.description,
        location: data.location,
        salary: data.salary,
        jobType: data.job_type,
        company: data.company,
        companyLocation: data.company_location,
      }

      this.setState({
        jobDetails: updatedJobDetails,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={() => this.getJobItemDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      title,
      description,
      location,
      salary,
      jobType,
      company,
      companyLocation,
    } = jobDetails

    return (
      <div className="job-details-content-container">
        <div className="job-details">
          <div className="title-rating-container-card">
            <h1 className="job-title-card">{title}</h1>
            <div className="rating-container-card">
              <AiFillStar className="star-icon-card" />
              <p className="rating-number-card">4</p>
            </div>
          </div>

          <p className="package-text">Company: {company}</p>

          <div className="location-package-container-card">
            <div className="icon-type-container-card">
              <IoLocationSharp className="type-icon" />
              <p className="type-text">{location}</p>
            </div>
            <div className="icon-type-container-card">
              <BsFillBriefcaseFill className="type-icon" />
              <p className="type-text">{jobType}</p>
            </div>
            <p className="package-text">₹{salary}</p>
          </div>

          <hr className="separator" />

          <h1 className="description-heading-card">Description</h1>
          <p className="job-description-card">{description}</p>

          <h1 className="description-heading-card">Company Location</h1>
          <p className="job-description-card">{companyLocation}</p>
        </div>
      </div>
    )
  }

  renderJobDetailsPage() {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-page">
        <Header />
        {this.renderJobDetailsPage()}
      </div>
    )
  }
}

export default JobItemDetails