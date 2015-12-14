Rails.application.routes.draw do
  devise_for :users
  get '/' => 'site#home'

  scope '/api' do
    resources :hotels, only: [:create]
    resources :point_of_interests, only: [:create]
  end

  get '/api/point_of_interests/get/:name' => 'point_of_interests#search'
  get '/api/point_of_interests/get_hotels_around/' => 'point_of_interests#find_hotels_around'
end
