import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",

  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,

  }

  // defaultImageUrl="https://static.india.com/wp-content/uploads/2022/08/solar-flare.jpg";
  capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  constructor(props) {
    
    super(props); //Always write this
    // console.log("I am News component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    }
    document.title = `NewsBox- ${this.capitalizeFirst(this.props.category)}`;
  }

  // Component did mount is a lifecycle which runs after the render method
  async updateNews() {
    console.log(this.props.apiKey)
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });

    let data = await fetch(url);
    this.props.setProgress(30);

    let parsedData = await data.json();
    this.props.setProgress(70);

    console.log(parsedData)//it will be a promise returne d by fetch API
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false
    });
    this.props.setProgress(100);

  }
  async componentDidMount() {
    // console.log("Cdm")
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({
      page: this.state.page - 1,
    });
    this.updateNews();
  }


  handleNextclick = async () => {

    // if(!(this.state.page + 1> Math.ceil(this.state.totalResults/this.props.pageSize)))
    // {

    this.setState({
      page: this.state.page + 1,
    });
    this.updateNews();
    // }

  }
  fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    this.setState({ page: this.state.page + 1 })
    this.setState({loading:true}) 
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData)//it will be a promise returne d by fetch API
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading:false
    });
  };

checkRes=()=>{
  if(this.state.articles.length === this.state.totalResults)
  {
    this.setState({loading:false})
  }
}
  render() {
    return (
      <>
        <h1 className='text-center' style={{margin : '90px 0px 35px 0px'}}> NewsBox- Top {this.capitalizeFirst(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}


        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={this.state.loading && <Spinner />} >

        
          <div className="container">

            <div className="row">
              {/* {!this.state.loading  && this.state.articles.map((element) => { */}
              {this.state.articles.map((element) => {


                return <div className="col-md-4" key={element.url}>
                  {/* As we are returning above div element we have to give the key in it */}
                  <NewsItem key={element.url} title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage ? element.urlToImage : "https://static.india.com/wp-content/uploads/2022/08/solar-flare.jpg"} newsUrl={element.url}
                    author={element.author} date={element.publishedAt}
                    source={element.source.name} />
                </div>

              })}
            </div>

          </div>
        </InfiniteScroll>

        {/* <div className="container d-flex justify-content-between">
          <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextclick}>Next &rarr;</button>

        </div> */}

      </>
    )
  }
}

export default News
