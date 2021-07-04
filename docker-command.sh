#!/bin/sh

# Add GitHub deployment key.
if [ ! -z "$GITHUB_TOKEN" ] && [ ! -z "$REMOTE_REPOSITORY" ];
then
	echo "[INFO] Adding Github deployment token ..."
	mkdir ~/.ssh
	echo -e $GITHUB_TOKEN >> ~/.ssh/id_rsa
	chmod 600 ~/.ssh/id_rsa

	host=$(echo $REMOTE_REPOSITORY | sed -e 's/.*@\(.*\):.*/\1/')

	touch ~/.ssh/known_hosts
	ssh-keyscan $host >> ~/.ssh/known_hosts

	echo "[OK] Added Github deployment token"
else
	echo "Missing GITHUB_TOKEN OR REMOTE_REPOSITORY environment variables. Aborting." && exit 1
fi

# Set up git user informations for bot.
if [ ! -z "$BOT_USERNAME" ] && [ ! -z "$BOT_MAIL" ];
then
	git config --global user.email "$BOT_MAIL"
	git config --global user.name "$BOT_USERNAME"
else
	echo "Missing BOT_MAIL OR BOT_USERNAME environment variables. Aborting." && exit 1
fi

# If running in test mode (i.e using Verdaccio as registry) set up npm token interactively.
if [ "$ENV" = "test" ] && [ ! -z "$NPM_REGISTRY" ]
then
	echo "[INFO] Setting up verdaccio/npm authentication"
	if [ -t 0 ] ; then
		npm adduser --registry http://$NPM_REGISTRY

		if [ -f ~/.npmrc ];
		then
			token=$(cat ~/.npmrc | sed -e 's/.*:_authToken="\(.*\)".*/\1/')
			export NPM_TOKEN=$token
			rm ~/.npmrc
		else
			echo "Unable to retrieve the token. Authentication failed." && exit 1
		fi
	else
		echo "Non interactive mode : you should run this container with -it flags. Aborting" && exit 1
	fi
	echo "[OK] Set up verdaccio/npm authentication"
fi

export running_in_docker=true;
node src/index.js
