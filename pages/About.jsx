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

                    <p>This site was setup to allow you to play Doomtown, a Pine Box Entertainment (PBE) game, in your browser.</p>

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

                    <h2>Patreon</h2>
                    <p>Become a Patron of Pinebox Entertainment <a href='https://www.patreon.com/pineboxentertainment' target='blank'>here</a> and help support Doomtown Online!</p>
                    <p>Patreon subscriptions help offset the cost of running the Doomtown Online server, domain registrations, etc and help support PBE so that they can continue making exciting games for everyone to enjoy!</p>

                    <h2>Special Thanks</h2>
                    <p>Special thanks go out to Shane Hensley and all the fine folks at Pinnacle Entertainment Group for creating the wonderful world of Deadlands, and allowing us to play in their sandbox.
                    </p>
                    <p>Also, a very special thank you to David Lapp and the rest of the Pinebox Entertainment crew for revitalizing this game and allowing us to bring Doomtown online for all to enjoy.</p>

                    <h2>Additional Notes</h2>
                    <p/>

                    <h2>Copyright Information</h2>
                    <p>
                    Deadlands: The Weird West, and Doomtown Artwork, logos, and the Pinnacle Logo are all &copy; Great White Games, LLC; DBA Pinnacle Entertainment Group and used with permission. Pine Box Entertaiment and the Pinebox logo are &copy; Pine Box Entertainment, LLC 2021.
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
