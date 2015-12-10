class CreateHotels < ActiveRecord::Migration
  def change
    create_table :hotels do |t|
      t.string :name
      t.string :address
      t.st_point :latlong, geographic: true

      t.timestamps null: false
    end
  end
end
