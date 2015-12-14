Rails.application.routes.draw do
  get '/' => 'site#home'
  devise_for :users
  resources :hotels, only: [:index, :destroy, :new, :create, :edit, :update]

  scope '/api' do
    resources :point_of_interests, only: [:create]
  end

  get '/api/point_of_interests/get/:name' => 'point_of_interests#search'
  get '/api/point_of_interests/get_hotels_around/' => 'point_of_interests#find_hotels_around'
end
