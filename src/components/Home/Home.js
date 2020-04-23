import React, { Component } from 'react';
import { 
    API_URL,
    API_KEY,
    IMAGE_BASE_URL,
    BACKDROP_SIZE,
    POSTER_SIZE } from '../../config'
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import './Home.css'

class Home extends Component {
    constructor() {
        super()
        this.state = {
            movies: [],
            heroImage: null,
            loading: false,
            currentPage: 0,
            totalPages: 0,
            searchTerm: ''
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        const endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        console.log(endPoint);
        this.fetchItems(endPoint);
    }

    searchIterms = (searchTerm) => {
        console.log(searchTerm);
        let endPoint = ''
        this.setState({
            movies: [],
            loading: true,
            searchTerm: ''
        })

        if (searchTerm === '') {
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        } else {
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`
        }
        console.log(endPoint);

        this.fetchItems(endPoint)
    }

    loadMoreItems = () => {
        let endPoint = '';
        this.setState({
            loading: true
        })

        if (this.state.searchTerm === '') {
            endPoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage + 1}`
        } else {
            endPoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query${this.state.searchTerm}&page=${this.state.currentPage + 1}`
        }
        this.fetchItems(endPoint)
    }

    fetchItems = (endPoint) => {
        fetch(endPoint)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({
                    movies: [...this.state.movies, ...result.results],
                    heroImage: this.state.heroImage || result.results[0], // Khi test, suy nghĩ them 
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages
                })
            })
            .catch(error => console.error('Error', error))
    }

    render() {
        console.log(this.state);
        return (
            <div className="rmdb-home">
                { this.state.heroImage  
                   ? <div>
                        <HeroImage 
                            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
                            title={this.state.heroImage.original_title}
                            text={this.state.heroImage.overview}
                        />
                        <SearchBar
                            callback={this.searchIterms}
                        />
                     </div>
                    : null
                }
                <FourColGrid/>
                <Spinner/>
                <LoadMoreBtn/>
            </div>
        );
    }
}

export default Home;