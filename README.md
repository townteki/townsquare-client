# townsquare-client
The client code for Townsquare, a Web based implementation of Doomtown: Reloaded

## About

This is client based on the throneteki-client. It is work in progress, but I am keeping throneteki readme for now.

## Contributing

The code is written in node.js(server) and react.js(client).  Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors.  Also bear in mind there is an .eslintrc file in the project so try to follow those rules.  This linting will be enforced in the build checks and pull requests will not be merged if they fail checks.

## Issues
If you encounter any issues on the site or while playing games, please raise an issue with as much detail as possible.

## Development

These instructions are only needed if you are actively working on the client.

```
git clone https://github.com/townteki/townsquare-client.git
cd townsquare-client
npm install
npm run start
```

### Coding Guidelines

All JavaScript code included in Townsquare should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
npm run lint
```

from repository's root.

