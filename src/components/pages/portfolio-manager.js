import React, { Component } from 'react';
import axios from 'axios';

import PortfolioSidebarList from '../portfolio/portfolio-sidebar-list';
import PortfolioForm from '../portfolio/portfolio-form';

export default class extends Component {
    constructor() {
        super();

        this.state= {
            portfolioItems: [],
            portfolioToEdit: {}
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditFormSubmission = this.handleEditFormSubmission.bind(this);
        this.handleNewFormSubmission = this.handleNewFormSubmission.bind(this);
        this.handleFormSubmissionError = this.handleFormSubmissionError.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this);
    }

    clearPortfolioToEdit() {
        this.setState({
            portfolioToEdit: {}
        });
    }

    handleEditClick(portfolioItem) {
        this.setState({
            portfolioToEdit: portfolioItem
        });
    }

    handleDeleteClick(portfolioItem) {
        axios.delete(`https://cohenyoung.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`,
         { withCredentials: true}
        ).then(response => {
            this.setState({
                portfolioItems: this.state.portfolioItems.filter(item => {
                    return item.id !== portfolioItem.id;
                })
            })

            return response.data;
        }).catch(error => {
            console.log("handleDeleteClick error", error);
        })
    }

    handleEditFormSubmission() {
        this.getPortfolioItems();
    }

    handleNewFormSubmission(portfolioItem) {
        this.setState({
            portfolioItems: [portfolioItem].concat(this.state.portfolioItems)
        })
    }

    handleFormSubmissionError(error) {
        console.log("error in form submission", error);
    }

    getPortfolioItems() {
        axios.get("https://cohenyoung.devcamp.space/portfolio/portfolio_items",
        {withCredentials: true
        })
        .then(response => {
            this.setState ({
                portfolioItems: [...response.data.portfolio_items]
            });
        })
        .catch(error => {
            console.log("error in getPortfolioItems", error)
        })
    }
    componentDidMount() {
        this.getPortfolioItems();
    }
    render() {
        return (
            <div className="portfolio-manager-wrapper">
               <div className="manager-left-column">
                   <PortfolioForm
                    handleNewFormSubmission={this.handleNewFormSubmission}
                    handleEditFormSubmission={this.handleEditFormSubmission}
                    handleFormSubmissionError= {this.handleFormSubmissionError}
                    clearPortfolioToEdit={this.clearPortfolioToEdit}
                    portfolioToEdit={this.state.portfolioToEdit}/>
               </div>
               <div className="manager-right-column">
                    <PortfolioSidebarList
                    handleDeleteClick={this.handleDeleteClick}
                    handleEditClick={this.handleEditClick}
                    data= {this.state.portfolioItems}/>
                </div>
            </div>
        )
    }
}