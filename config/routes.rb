Rails.application.routes.draw do
  
  get '/' => 'site#home'
  devise_for :users
  resources :hotels, only: [:index, :destroy, :new, :create, :edit, :update]
  resources :cities, only: [:index, :show, :new, :create, :edit, :update, :destroy]
  scope '/api' do
    resources :point_of_interests, only: [:create] do
      get :find_hotels_around, on: :collection
    end
  end

  get '/api/point_of_interests/get/:name' => 'point_of_interests#search'
  
end