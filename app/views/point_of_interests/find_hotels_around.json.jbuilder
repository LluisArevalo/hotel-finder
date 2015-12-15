json.array!(@hotels) do |hotel|
  json.extract! hotel, :name, :price, :website
  json.lat hotel.latlong.x
  json.lng hotel.latlong.y
end