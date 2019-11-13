import * as ReactDOM from 'react-dom';
import * as React from 'react';

const e = React.createElement;

interface Gem {
    documentation_uri: string;
}

class Main extends React.Component {
    gemsStorageKey = 'savedGems';

    constructor(props) {
        super(props);

        this.state = {
            gems: [],
            savedGems: this.retrieveSavedGems()
        }
    }

    renderGems(list: Gem[]) {
        if (!list || !list.length) {
            return <p>No results</p>
        }
        return list.map((gem) =>
            <li key={gem.documentation_uri}>
                {gem.documentation_uri}
                <button
                    onClick={this.saveGem.bind(this, gem.documentation_uri)}
                >{this.state.savedGems.indexOf(gem.documentation_uri) >= 0 ? 'saved' : 'save'}</button>
            </li>
    }

    render() {
        return <div>
            <input type="text" onChange={this.handleChange.bind(this)} />
            <ul className="gems">{this.renderGems(this.state.gems)}</ul>
        </div>
    }

    handleChange(event: React.SyntheticEvent) {
        fetch(`http://localhost:3000/api/v1/search.json?query=${event.target.value}`)
            .then(res => res.json())
            .then(result => this.setState({ gems: result }));
    }

    saveGem(key: string) {
        const gemsToSave = [...this.state.savedGems];
        gemsToSave.push(key);

        this.setState({ savedGems: gemsToSave });
        localStorage.setItem(this.gemsStorageKey, gemsToSave.join(','))
    }

    retrieveSavedGems(): string[] {
        let savedGems = localStorage.getItem(this.gemsStorageKey);
        if (savedGems) {
            return savedGems.split(',');
        }

        return [];
    }
}

const domContainer = document.querySelector("#root");
ReactDOM.render(e(Main), domContainer);