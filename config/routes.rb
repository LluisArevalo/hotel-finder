Rails.application.routes.draw do
  get '/' => 'site#home'

  get '/api/poi/new/' => 'pointsofinterest#create'
  get '/api/poi/get/:name' => 'pointsofinterest#get'
end
