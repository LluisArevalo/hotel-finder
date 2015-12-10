class Searcher
  def self.search_hotels_around poi_id_array
    hotels = []

    poi_id_array.each do |id|
      poi = PointOfInterest.find_by_id id
      
      poi.find_hotels_around.each do |hotel|
        hotels << hotel
      end
    end

    select_matching_hotels(hotels)
  end

  private

  def self.select_matching_hotels hotels
    (hotels.find_all { |hotel| hotels.count(hotel) > 1 }).uniq
  end
end