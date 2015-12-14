require 'rails_helper'

RSpec.describe PointOfInterest, type: :model do
  context 'without any point of interest' do
    it 'should not return any result searching an string contained in the name' do
      poi = PointOfInterest.by_name 'test'
      expect(poi.length).to be(0)
    end

    it 'should not return any result searching by the exactly name' do
      poi = PointOfInterest.get_by_name 'test-poi'
      expect(poi).to be_empty
    end
  end

  context 'with a point of interest' do
    before(:each) do
      @ironhack = PointOfInterest.create({ name: 'test-poi', 
                                           address: 'Calle Núñez de Balboa, 120, 28006 Madrid, España',
                                           latitude: 40.438308,
                                           longitude: -3.68153800000005 })

      hotel = Hotel.create({ name: 'test-hotel', 
                             address: 'Calle de Claudio Coello, 139, 28006 Madrid, Madrid, España',
                             latlong: 'POINT(40.4355254 -3.6855281000000056)',
                             price: 10,
                             website: 'http://www.website.com/' })
    end

    it 'should return a result searching an string contained in the name' do
      poi = PointOfInterest.by_name 'test'
      expect(poi.length).to be(1)
    end

    it 'should return a result searching by the exactly name' do
      poi = PointOfInterest.get_by_name 'test-poi'
      expect(poi).not_to be_nil
    end

    it 'should return a hotel searching around the point of interest' do
      hotels = @ironhack.find_hotels_around
      expect(hotels.length).to be(1)
    end
  end
end
