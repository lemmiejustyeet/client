import * as React from "react";
import { getAllSongs, ISong, IUser } from "./comm";
import Mashup from "./Mashup";

export default class MashupController extends React.Component<{sort?: string, currentuser?: IUser}, {songs: ISong[]}> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            songs: []
        };

        (async () => {
            this.setState({
                songs: await getAllSongs()
            });
        })();
    }

    public render() {
        return (
            <div className="mashups">
                {
                    this.state.songs
                        .sort((a, b) => b.date - a.date)
                        .map((x) => <Mashup song={x} key={x._id} controller={this} currentuser={this.props.currentuser}/>)
                }
            </div>
        );
    }

    public async refresh() {
        this.setState({
            songs: await getAllSongs()
        });
    }
}