Rails.application.routes.draw do
  get '/' => 'site#home'

  namespace :api do
    resources :hotels, only: [:create]
    resources :point_of_interests, only: [:create]
  end
  
  #TODO: Meter todas las URL's en el namespace
  get '/api/poi/get/:name' => 'point_of_interests#search'
  get '/api/poi/get_hotels_around/' => 'point_of_interests#find_hotels_around'
end
