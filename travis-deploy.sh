##!/usr/bin/env bash

echo -e "Testing travis-encrypt"
echo -e "$VARNAME"

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
	
	if [ "$TRAVIS" == "true" ]; then
		git config --global user.email "travis@billynate.com"
		git config --global user.name "Travis CI"
	fi
	
	echo -e "Checkout $TRAVIS_BRANCH and gh-pages branches\n"
	git clone --quiet --branch=$TRAVIS_BRANCH https://${GH_TOKEN}@github.com/$TRAVIS_REPO_SLUG source > /dev/null
	git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/$TRAVIS_REPO_SLUG gh_pages > /dev/null
	
	cd ./gh_pages
	
	echo -e "Clean up\n"
	git rm -rf .
	git clean -f -d
	
	echo -e "Restore persistent files\n"
	git checkout HEAD README.md
	
	cd ..
	
	echo -e "Copy over files to gh-pages\n"
	cp -R ./source/demo/* ./gh_pages/
	cp -R ./source/dist/css/* ./gh_pages/css/
	
	cd ./gh_pages
	
	echo -e "Correct file links\n"
	sed -i -e 's/..\/dist\///g' ./index.html
	
	echo -e "Commit and push\n"
	git add -f .
	git commit -m "Travis build $TRAVIS_BUILD_NUMBER"
	git push -fq origin gh-pages > /dev/null
	
	echo -e "Deploy completed\n"
fi