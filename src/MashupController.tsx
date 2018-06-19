import * as React from "react";
import { getAllSongs, ISong, IUser } from "./comm";
import Mashup from "./Mashup";

export default class MashupController extends React.Component<{sort?: string, currentuser?: IUser}, {songs: ISong[]}> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            songs: []
        };

        this.refresh();

        // REFRESH EVERY 10 MINUTES
        setInterval(this.refresh, 1000 * 60 * 10);
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

    public refresh = async () => {
        this.setState({
            songs: await getAllSongs()
        });
    }
}