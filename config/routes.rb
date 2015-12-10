Rails.application.routes.draw do
  get '/' => 'site#home'

  get '/api/poi/new/' => 'pointsofinterest#create'
  get '/api/poi/get/:name' => 'pointsofinterest#search'
  get '/api/poi/get_hotels_around/' => 'pointsofinterest#find_hotels_around'
  get '/api/hotel/new/' => 'hotels#create'
end
