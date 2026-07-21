export type OperationType = 'income' | 'outcome'
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
export type BusinessType = 'B2B' | 'B2C'

export interface FacetsResponse {
	operation_types: OperationType[]
	business_types: BusinessType[]
	categories: Category[]
	min_date: string // YYYY-MM-DD
	max_date: string // YYYY-MM-DD
}

export interface AlertEntry {
	period: string
	outcome_total: number
	baseline_average: number
	increase_ratio: number
}

export type AlertsResponse = AlertEntry[]

export interface CategoryEntry {
	category: Category
	operation_type: OperationType
	total_amount: number
}

export type TopCategoriesResponse = CategoryEntry[]
