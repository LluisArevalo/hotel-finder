require 'rails_helper'

RSpec.describe HotelsController, type: :controller do

end

RSpec.describe 'hotel routes', type: :routing do
  before(:each) do
    @hotel = Hotel.create({ name: 'Hotel name' })
  end

  it 'routes /hotels to the hotels controller' do
    expect(get(hotels_path)).to route_to(:controller => 'hotels', :action => 'index')
  end

  it 'routes /hotels to the hotels controller' do
    expect(post(hotels_path)).to route_to(:controller => 'hotels', :action => 'create')
  end

  it 'routes /hotels/new to the hotels controller' do
    expect(get(new_hotel_path)).to route_to(:controller => 'hotels', :action => 'new')
  end

  it 'routes /hotels/:id/edit to the hotels controller' do
    expect(get(edit_hotel_path(@hotel))).to route_to(:controller => 'hotels', :action => 'edit', :id => "#{@hotel.id}")
  end

  it 'routes /hotels/:id to the hotels controller' do
    expect(patch(hotel_path(@hotel))).to route_to(:controller => 'hotels', :action => 'update', :id => "#{@hotel.id}")
  end

  it 'routes /hotels/:id to the hotels controller' do
    expect(put(hotel_path(@hotel))).to route_to(:controller => 'hotels', :action => 'update', :id => "#{@hotel.id}")
  end

  it 'routes /hotels/:id to the hotels controller' do
    expect(delete(hotel_path(@hotel))).to route_to(:controller => 'hotels', :action => 'destroy', :id => "#{@hotel.id}")
  end
end