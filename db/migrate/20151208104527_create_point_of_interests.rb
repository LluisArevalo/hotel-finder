class CreatePointOfInterests < ActiveRecord::Migration
  def change
    create_table :point_of_interests do |t|
      t.string :name, index: true
      t.float :latitude
      t.float :longitude
      
      t.timestamps null: false
    end
  end
end
