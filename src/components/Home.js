import React, { Component } from 'react';
import '../App.scss';
import Chart from 'react-google-charts';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            season: '',
            sortBy: 'points',
            chart: 'ColumnChart',
            seasonNumber:'',
            err: '',
            data: '',
            loading: true
        }
    }

    sortByValue = (event) => {
        this.setState({
            sortBy: event.target.value
        }, this.searchSeason);
    };

    chartValue = (event) => {
        this.setState({
            chart: event.target.value
        });
    };

    searchSeason = () => {
        let url = `http://ergast.com/api/f1/2018/driverStandings.json`;
        fetch(url).then(resp => {
            return resp.json();
        }).then(json => {

            let resultArray = json.MRData.StandingsTable.StandingsLists.map((element) => {
                let result = element.DriverStandings.map((element) => {
                    let data = [];
                    data.push(element.Driver.familyName);
                    if(this.state.sortBy === 'points') {
                        data.push(Number(element.points));
                    } else {
                        data.push(Number(element.wins));
                    }
                    return data;
                });
                return result;
            });

            let sortWinsArray = [];
            let winsArray = [[]];
            if(this.state.sortBy === 'wins') {
                for(let i=0; i<resultArray[0].length; i++) {
                    let driver = resultArray[0][i][0];

                    let count = resultArray[0][i][1];

                    sortWinsArray.push({count: count, driver: driver})
                }
                sortWinsArray.sort((a,b) => {
                    return Number(a.count) - Number(b.count);
                });
                sortWinsArray.reverse();
                for (let i=0; i<sortWinsArray.length; i++) {
                    winsArray[0].push([sortWinsArray[i].driver, sortWinsArray[i].count]);
                }
            }

            if(this.state.sortBy === 'points') {
                resultArray[0].unshift(['', 'Punkty']);
                this.setState({
                    data: resultArray,
                });
            } else {
                winsArray[0].unshift(['', 'Wygrane rundy']);
                this.setState({
                    data: winsArray,
                });
            }

            let seasonNumber = json.MRData.StandingsTable.season;

            let roundNumber = json.MRData.StandingsTable.StandingsLists.map((element) => {
                return element.round;
            });

            this.setState({
                seasonNumber: seasonNumber,
                roundNumber: roundNumber,
                loading: false,
                err: '',
            })

        }).catch(() => {
            this.setState({
                seasonNumber: 'Error',
                err: 'Error',
            })
        });
    };

    render() {

        let loading =
            <div className='col-8 loadingHomePosition'>
                <div className='loading'/>
            </div>;

        if (this.state.data === '') {
            this.searchSeason();
        }

        let formAndBtn =
            <div>
                <form className='formBanner'>
                    <select onChange={this.sortByValue}>
                        <option value="points">Zdobyte punkty</option>
                        <option value="wins">Wygrane wyścigi</option>
                    </select>
                    <select onChange={this.chartValue}>
                        <option value="ColumnChart">Wykres blokowy</option>
                        <option value="LineChart">Wykres liniowy</option>
                    </select>
                </form>
            </div>;

        let banner =
            <div className='col-4 banner'>
                <h1>F1<span>stats</span>!</h1>
                <h2>Statystyki wyścigów Formuły 1</h2>
                <p>Witaj na F1stats! Projekt przedstawia statystyki z wyścigów F1 na bazie danych pobranych z <span><b>Ergast API</b></span>. Na podstawie przetworzonych danych generowane są wykresy lub tabele ze statystykami dotyczącymi najbardziej prestiżowego sportu motorowego na świecie!</p>
            </div>;

        let bannerAndBtn =
            <div className='col-4 banner'>
                <h1>F1stats!</h1>
                <h2>Statystyki wyścigów Formuły 1</h2>
                <p>Witaj na F1stats! Projekt przedstawia statystyki z wyścigów F1 na bazie danych pobranych z <span><b>Ergast API</b></span>. Na podstawie przetworzonych danych generowane są wykresy lub tabele ze statystykami dotyczącymi najbardziej prestiżowego sportu motorowego na świecie!</p>
                {formAndBtn}
            </div>;

        if (this.state.seasonNumber === '') {
            return (
                <div className='row'>
                    {banner}
                    {loading}
                </div>
            );
        } else if(this.state.err !== '') {
            return (
                <div className='row'>
                    {banner}
                    <ul className='dataList'>
                        <li>Nie znaleziono takiego sezonu</li>
                    </ul>
                </div>
            );
        } else {
            return (
                <div className='row'>
                    {bannerAndBtn}
                    <div className='col-8'>
                        <div className='chartSize'>
                            <Chart
                                key={this.state.chart}
                                height='79.5vh'
                                chartType={this.state.chart}
                                data={
                                    [...this.state.data[0]]
                                }
                                options={{
                                    chartArea: { left: 60, right: 60, top: 60, bottom: 130 },
                                    legend: {position: 'none'},
                                    fontSize: 16,
                                    colors: ['darkorange'],
                                    animation: {
                                        duration: 1000,
                                        easing: 'out',
                                        startup: true,
                                    },
                                    hAxis: {
                                        showTextEvery: 1,
                                        textStyle : {
                                            fontSize: 14
                                        },
                                        slantedText: true,
                                        slantedTextAngle: 60
                                    },
                                    vAxis: {
                                        textStyle : {
                                            fontSize: 12,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Home;
