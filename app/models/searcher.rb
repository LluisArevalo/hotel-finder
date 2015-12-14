class Searcher
  def self.search_hotels_around poi_id_array
    hotels = []

    poi_id_array.each do |id|
      poi = PointOfInterest.find_by_id id
      
      poi.find_hotels_around.each do |hotel|
        hotels << hotel
      end
    end

    select_matching_hotels(hotels, poi_id_array)
  end

  private

  def self.select_matching_hotels hotels, poi_id_array
    percent = poi_id_array.length / 2.0

    filtered = hotels.find_all do |hotel| 
      hotels.count(hotel) >=  percent
    end

    filtered.uniq
  end
end