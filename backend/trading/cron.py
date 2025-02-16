# from django_cron import CronJobBase, Schedule
# from .views import update_portfolio_and_balance

# class UpdatePortfolioCronJob(CronJobBase):
#     schedule = Schedule(run_every_mins=10)
#     code = 'yourapp.update_portfolio_cron_job'

#     def do(self):
#         request = None 
#         update_portfolio_and_balance(request)