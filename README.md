# GitHub 1s Extensions

![GitHub 1s Extensions](screenshot.png)

This repository contains the source code for my [GitHub1s](https://github.com/conwnet/github1s) related browser extensions.

## How The Extensions Work

Each extension adds a button to your browser extension icons so that when viewing a GitHub repository your can enable the extension to view the repository within VS Code from within your browser.

![screenshot](browser-extension-icons.png)

The icons are coloured as follows:

- Dark Gray - You are not viewing a GitHub domain, the GitHub 1s functionality is not available.
- Light Gray - You are viewing a GitHub repository, the GitHub 1s functionality is not enabled.
- Blue - You are viewing a GitHub repository, the GitHub 1s functionality is enabled.

The icons were provided kindly by [Ronak Rai](https://www.linkedin.com/in/ronak-rai/).

## The GitHub1s Project

The core functionality is provided by the [GitHub1s](https://github.com/conwnet/github1s) project. The extensions here merely use the url feature provided by GitHub1s to enable the ability to view a repository within VS Code.

Thanks should go to the project for a genuinely useful feature they have provided.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Clone this repository.

_HTTPS_

```
git clone https://github.com/andy-crouch/github1s-extensions.git
```

_GitHub Cli_

```
gh repo clone andy-crouch/github1s-extensions
```

There are no additional prerequisites required to get this code running locally.

## Deployment

Details to be added.

## Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on the code of conduct, and the process for submitting pull requests to this project.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
