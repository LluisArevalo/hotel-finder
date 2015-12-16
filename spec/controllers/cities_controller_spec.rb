require 'rails_helper'

RSpec.describe CitiesController, type: :controller do

end

RSpec.describe 'city routes', type: :routing do
  before(:each) do
    @city = City.create({ name: 'City', latitude: 0, longitude: 0 })
  end

  it 'routes /cities to the cities controller' do
    expect(get(cities_path)).to route_to(:controller => 'cities', :action => 'index')
  end

  it 'routes /cities to the cities controller' do
    expect(post(cities_path)).to route_to(:controller => 'cities', :action => 'create')
  end

  it 'routes /cities/new to the cities controller' do
    expect(get(new_city_path)).to route_to(:controller => 'cities', :action => 'new')
  end

  it 'routes /cities/:id/edit to the cities controller' do
    expect(get(edit_city_path(@city.id))).to route_to(:controller => 'cities', :action => 'edit', :id => "#{@city.id}")
  end

  it 'routes /cities/:id to the get action in the cities controller' do
    expect(get(city_path(@city))).to route_to(:controller => 'cities', :action => 'show', :id => "#{@city.id}")
  end

  it 'routes /cities/:id to the delete action in the cities controller' do
    expect(delete city_path(@city)).to route_to(:controller => 'cities', :action => 'destroy', :id => "#{@city.id}")
  end

  it 'routes /cities/:id to the patch action in the cities controller' do
    expect(patch city_path(@city)).to route_to(:controller => 'cities', :action => 'update', :id => "#{@city.id}")
  end

  it 'routes /cities/:id to the put action in the cities controller' do
    expect(put city_path(@city)).to route_to(:controller => 'cities', :action => 'update', :id => "#{@city.id}")
  end
end