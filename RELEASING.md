# Releasing Event Gateway SDK

After all [pull requests](https://github.com/serverless/serverless-event-gateway-plugin/pulls) for a release have been merged and all [Travis CI builds](https://travis-ci.org/serverless/serverless-event-gateway-plugin) are green, you may create a release as follows:

1. If you haven't already, switch to the master branch, ensure that you have no changes, and pull from origin.

    ```sh
    $ git checkout master
    $ git status
    $ git pull <remote> master --rebase
    ```

1. Edit the `package.json` file changing `version` field to your new release version.

1. Commit your changes.

    ```sh
    $ git commit -am "Release <version>"
    ```

1. Tag the version.

    ```sh
    $ git tag v<version>
    ```

1. Push the commit and tag.

    ```sh
    $ git push origin head --tags
    ```

1. Travis CI will publish new version to NPM.

1. Publish new release on GitHub with [`release`](https://github.com/zeit/release) package.

    ```sh
    $ npx release -P
    ```
