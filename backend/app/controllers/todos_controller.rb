class TodosController < ApplicationController
  before_action :set_todo, only: %i[ show update destroy ]

  # GET /todos
  def index
    @todos = Todo.where(:user_id => @current_user.id)

    render json: @todos
  end

  # GET /todos/1
  def show
    render json: @todo
  end

  # POST /todos
  def create
    @todo = Todo.new(todo_params)
    @todo.user_id = @current_user.id

    if @todo.save
      render json: @todo, status: :created, location: @todo
    else
      render json: @todo.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /todos/1
  def update
    if @todo.user_id == @current_user.id
      if @todo.update(todo_params)
        render json: @todo
      else
        render json: @todo.errors, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not Found' }, status: :not_found
    end
  end

  # DELETE /todos/1
  def destroy
    if @todo.user_id == @current_user.id
      @todo.destroy!
    else
      render json: { error: 'Not Found' }, status: :not_found
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def todo_params
      params.require(:todo).permit(:title, :description, :status, :due_date, :user_id)
    end
end
