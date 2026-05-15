import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesChecked: [],
    locations: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  updateEmploymentTypesChecked = typeId => {
    const {employmentTypesChecked} = this.state
    let updatedList = employmentTypesChecked
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        eachType => eachType !== typeId,
      )
    } else {
      updatedList = [...updatedList, typeId]
    }

    this.setState({employmentTypesChecked: updatedList}, this.getJobs)
  }

  updateLocationsChecked = locationId => {
    const {locations} = this.state
    let updatedList = locations
    if (locations.includes(locationId)) {
      updatedList = locations.filter(eachType => eachType !== locationId)
    } else {
      updatedList = [...updatedList, locationId]
    }

    this.setState({locations: updatedList}, this.getJobs)
  }

  updateSalaryRangeId = activeSalaryRangeId =>
    this.setState({activeSalaryRangeId}, this.getJobs)

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {activeSalaryRangeId, employmentTypesChecked, searchInput} = this.state
    const employTypes = employmentTypesChecked.join(',')

    const apiUrl = `https://workbridge-production-2832.up.railway.app/api/jobs?employment_type=${employTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.map(eachJob => ({
        companyLogoUrl: '',
        employmentType: eachJob.job_type,
        id: eachJob.id,
        jobDescription: eachJob.description,
        location: eachJob.location,
        packagePerAnnum: eachJob.salary,
        rating: 4,
        title: eachJob.title,
        company: eachJob.company,
      }))
      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const updatedData = {
      name: 'Thoyaj Kumar',
      profileImageUrl: 'https://assets.ccbp.in/frontend/react-js/male-avatar-img.png',
      shortBio: 'Full Stack Developer',
    }
    this.setState({
      profileDetails: updatedData,
      profileApiStatus: apiStatusConstants.success,
    })
  }

  renderSearchBar = searchBarID => {
    const {searchInput} = this.state
    return (
      <div className="search-bar" id={searchBarID}>
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={e => this.setState({searchInput: e.target.value})}
        />
        <button
          className="search-button"
          type="button"
          data-testid="searchButton"
          onClick={() => this.getJobs()}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderSideBar = () => {
    const {
      profileDetails,
      profileApiStatus,
      activeSalaryRangeId,
      employmentTypesChecked,
      locations,
    } = this.state
    return (
      <div className="side-bar">
        {this.renderSearchBar('smallSearchBar')}
        <ProfileDetails
          profileDetails={profileDetails}
          profileApiStatus={profileApiStatus}
          getProfileDetails={this.getProfileDetails}
        />
        <hr className="separator" />
        <FiltersGroup
          updateSalaryRangeId={this.updateSalaryRangeId}
          activeSalaryRangeId={activeSalaryRangeId}
          updateEmploymentTypesChecked={this.updateEmploymentTypesChecked}
          employmentTypesChecked={employmentTypesChecked}
          updateLocationsChecked={this.updateLocationsChecked}
          locationsChecked={locations}
        />
      </div>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList, locations} = this.state
    const filteredJobsList =
      locations.length === 0
        ? jobsList
        : jobsList.filter(eachJob =>
            locations.includes(eachJob.location.toUpperCase()),
          )
    return (
      <>
        {filteredJobsList.length > 0 ? (
          <ul className="jobs-list">
            {filteredJobsList.map(eachJob => (
              <JobCard key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  renderJobsLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsApiFailureView = () => (
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
        onClick={() => this.getJobs()}
      >
        Retry
      </button>
    </div>
  )

  renderJobsBasedOnAPiStatus = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobs-page-container">
        <Header />
        <div className="jobs-page">
          {this.renderSideBar()}
          <div className="jobs-container">
            {this.renderSearchBar('largeSearchBar')}
            {this.renderJobsBasedOnAPiStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs