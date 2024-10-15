class MakeDueDateTimestampTz < ActiveRecord::Migration[7.2]
  def change
    change_column(:todos, :due_date, :timestamp)
  end
end
