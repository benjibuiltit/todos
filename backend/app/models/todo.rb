class Todo < ApplicationRecord
    enum status: { pending: 0, complete: 1 }
end
