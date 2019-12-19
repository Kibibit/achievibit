if [[ -z $TRAVIS_PULL_REQUEST ]]; then
  echo 'not on travis pull request'
elif [[ -z $NOW_TOKEN ]]; then
  echo 'did not have a NOW token as an ENV variable'
else
  now alias --token=$NOW_TOKEN $(now ./test-results --static --no-clipboard --token=$NOW_TOKEN --public) achievibit-pr-$TRAVIS_PULL_REQUEST
fi
