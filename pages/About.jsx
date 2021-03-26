import React from 'react';

import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';

class About extends React.Component {
    render() {
        return (
            <div className='col-xs-12 full-height'>
                <Panel title='About Doomtown Online - Help and information'>
                    <a className='btn btn-danger btn-lg pull-right' target='_blank' href='https://github.com/townteki/townsquare/issues'>Report Problems</a>
                    <h3>What is this?</h3>

                    <p>This site was setup to allow you to play Doomtown card game, a Pine Box Entertainment (PBE) in your browser.</p>

                    <h3>That's pretty cool!  But how does any of this work?</h3>
                    <p>Head on over to the <Link href='/how-to-play'>How To Play guide</Link> for a thorough explanation.</p>

                    <h3>Everyone has a shiny avatar, how do I get one?</h3>
                    <p>This is handled by the good people at <a href='http://gravatar.com' target='_blank'>Gravatar</a>.  Sign up there with the same email address you did there and it should appear on the site after a short while.
                It will also use the avatar on any site that uses gravatar. </p>

                    <h3>The artwork on this site is pretty cool, where's that from?</h3>
                    <p>You're right, it is pretty nice isn't it?</p>

                    <p>Info about artwork will be added.</p>

                    <h3>Can I help?</h3>
                    <p>Sure!  The project is all written in Javascript.  The server is node.js and the client is React.js.  The source code can be found in the&nbsp;
                        <a target='_blank' href='http://github.com/townteki/townsquare'>GitHub Repository</a>.  Check out the code and instructions on there on how to get started and hack away!  See the card implementation
                status list above to have a look at what needs to be done.  If you want to join the dev discord, or ask any other question, send me a note on here, over at&nbsp;
                    </p>

                    <h4>Donations</h4>
                    Possible donations here.

                    <h2>Special Thanks</h2>
                    <p>Special thanks here.
                    </p>

                    <h2>Additional Notes</h2>
                    <p>Additional notes here.
                    </p>
                </Panel>
            </div>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
